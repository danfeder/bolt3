from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime

class TimeSlot(BaseModel):
    period: int
    day: str

class Class(BaseModel):
    id: str
    name: str
    gradeLevel: str
    constraints: List[TimeSlot]

class ScheduleRequest(BaseModel):
    classes: List[Class]
    teacherConstraints: List[TimeSlot]
    periodsPerDay: int
    maxPeriodsPerDay: int
    maxPeriodsPerWeek: int
    allowConsecutivePeriods: bool
    startDate: str

class ScheduleResponse(BaseModel):
    id: str
    startDate: datetime
    endDate: datetime
    classes: List[Class]
    assignments: Dict[str, List[TimeSlot]]