from ortools.sat.python import cp_model
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from .models import Class, TimeSlot

class ScheduleSolver:
    def __init__(
        self,
        classes: List[Class],
        teacher_constraints: List[TimeSlot],
        periods_per_day: int,
        max_periods_per_day: int,
        max_periods_per_week: int,
        allow_consecutive_periods: bool
    ):
        self.classes = classes
        self.teacher_constraints = teacher_constraints
        self.periods_per_day = periods_per_day
        self.max_periods_per_day = max_periods_per_day
        self.max_periods_per_week = max_periods_per_week
        self.allow_consecutive_periods = allow_consecutive_periods
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.variables: Dict[str, cp_model.IntVar] = {}

    def create_variables(self):
        print("Creating variables...")
        for cls in self.classes:
            for day in self.days:
                for period in range(1, self.periods_per_day + 1):
                    var_name = f"{cls.id}_{day}_{period}"
                    self.variables[var_name] = self.model.NewBoolVar(var_name)
        print(f"Created {len(self.variables)} variables")

    def add_basic_constraints(self):
        print("Adding basic constraints...")
        # Class constraints
        for cls in self.classes:
            for constraint in cls.constraints:
                var_name = f"{cls.id}_{constraint.day}_{constraint.period}"
                if var_name in self.variables:
                    self.model.Add(self.variables[var_name] == 0)

        # Teacher constraints
        for constraint in self.teacher_constraints:
            for cls in self.classes:
                var_name = f"{cls.id}_{constraint.day}_{constraint.period}"
                if var_name in self.variables:
                    self.model.Add(self.variables[var_name] == 0)

        # One class per period
        for day in self.days:
            for period in range(1, self.periods_per_day + 1):
                period_vars = []
                for cls in self.classes:
                    var_name = f"{cls.id}_{day}_{period}"
                    if var_name in self.variables:
                        period_vars.append(self.variables[var_name])
                if period_vars:
                    self.model.Add(sum(period_vars) <= 1)

    def add_scheduling_constraints(self):
        print("Adding scheduling constraints...")
        # Each class must be scheduled exactly once per week
        for cls in self.classes:
            class_vars = []
            for day in self.days:
                for period in range(1, self.periods_per_day + 1):
                    var_name = f"{cls.id}_{day}_{period}"
                    if var_name in self.variables:
                        class_vars.append(self.variables[var_name])
            if class_vars:
                self.model.Add(sum(class_vars) == 1)

        # Maximum periods per day
        for day in self.days:
            day_vars = []
            for cls in self.classes:
                for period in range(1, self.periods_per_day + 1):
                    var_name = f"{cls.id}_{day}_{period}"
                    if var_name in self.variables:
                        day_vars.append(self.variables[var_name])
            if day_vars:
                self.model.Add(sum(day_vars) <= self.max_periods_per_day)

        # Maximum periods per week
        all_vars = []
        for cls in self.classes:
            for day in self.days:
                for period in range(1, self.periods_per_day + 1):
                    var_name = f"{cls.id}_{day}_{period}"
                    if var_name in self.variables:
                        all_vars.append(self.variables[var_name])
        if all_vars:
            self.model.Add(sum(all_vars) <= self.max_periods_per_week)

        # Consecutive periods constraint
        if not self.allow_consecutive_periods:
            for day in self.days:
                for period in range(1, self.periods_per_day):
                    current_vars = []
                    next_vars = []
                    for cls in self.classes:
                        current = f"{cls.id}_{day}_{period}"
                        next = f"{cls.id}_{day}_{period + 1}"
                        if current in self.variables and next in self.variables:
                            current_vars.append(self.variables[current])
                            next_vars.append(self.variables[next])
                    if current_vars and next_vars:
                        self.model.Add(sum(current_vars) + sum(next_vars) <= 1)

    def solve(self) -> Tuple[bool, Dict[str, List[TimeSlot]]]:
        try:
            print("Starting solver...")
            self.create_variables()
            self.add_basic_constraints()
            self.add_scheduling_constraints()

            print("Solving model...")
            status = self.solver.Solve(self.model)
            print(f"Solver status: {status}")

            if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
                assignments = {}
                for cls in self.classes:
                    assignments[cls.id] = []
                    for day in self.days:
                        for period in range(1, self.periods_per_day + 1):
                            var_name = f"{cls.id}_{day}_{period}"
                            if var_name in self.variables and self.solver.Value(self.variables[var_name]) == 1:
                                assignments[cls.id].append(TimeSlot(day=day, period=period))
                print(f"Found solution with {sum(len(slots) for slots in assignments.values())} assignments")
                return True, assignments

            print("No solution found")
            return False, {}
            
        except Exception as e:
            print(f"Solver error: {str(e)}")
            raise