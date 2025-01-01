from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from .models import ScheduleRequest, ScheduleResponse
from .solver import ScheduleSolver

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/schedule", response_model=ScheduleResponse)
async def generate_schedule(request: ScheduleRequest):
    try:
        solver = ScheduleSolver(
            classes=request.classes,
            teacher_constraints=request.teacherConstraints,
            periods_per_day=request.periodsPerDay,
            max_periods_per_day=request.maxPeriodsPerDay,
            max_periods_per_week=request.maxPeriodsPerWeek,
            allow_consecutive_periods=request.allowConsecutivePeriods
        )
        
        success, assignments = solver.solve()
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail="No feasible schedule found with the given constraints"
            )
            
        start_date = datetime.strptime(request.startDate, "%Y-%m-%d")
        return ScheduleResponse(
            id=f"schedule_{start_date.strftime('%Y%m%d')}",
            startDate=start_date,
            endDate=start_date + timedelta(days=14),  # 2-week schedule
            classes=request.classes,
            assignments=assignments
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))