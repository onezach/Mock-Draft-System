from copy import deepcopy
import csv
from threading import Thread
import time
from exceptions import InvalidDraftPick

class Draft:

    def __init__(self, num_rounds: int, teams: list[str], time_per_pick: int):
        self.num_rounds = num_rounds
        self.teams = teams
        self.num_teams = len(teams)
        self.time_per_pick = time_per_pick
        self.time_on_clock = time_per_pick
        self.clock_running = False
        self.complete = False
        self.total_picks = num_rounds * len(teams)

        cell = {"name": "", "team": "", "position": "", "position_rank": 0, "show": False}
        p = []
        for i in range(num_rounds):
            temp = []
            for j in range(len(teams)):
                temp.append(deepcopy(cell))
            p.append(temp)

        self.picks = p

        self.current_pick = {"round": 1, "number": 1, "overall": 1}
        self.position_counts = {"QB": 1, "RB": 1, "WR": 1, "TE": 1, "K": 1, "DST": 1}

        self.start_timer()

    def make_pick(self, name: str, team: str, position: str):
        '''
        Adds a new pick to the draft board.
        
        Parameters:
            name (str): The name of the picked player
            team (str): The team of the picked player
            position (str): The position of the picked player
        '''
        self.stop_timer()

        # validate - raise InvalidDraftPick exception on attempted duplicate pick
        for i in range(len(self.picks)):
            for j in range(len(self.picks[i])):
                if self.picks[i][j]["show"] and (name == self.picks[i][j]["name"]) and (team == self.picks[i][j]["team"]) and (position == self.picks[i][j]["position"]):
                    self.resume_timer()
                    raise InvalidDraftPick

        r = self.current_pick["round"] - 1
        n = self.current_pick["number"] - 1 if self.current_pick["round"] % 2 == 1 else self.num_teams - self.current_pick["number"]

        self.picks[r][n].update({
            "name": name,
            "team": team,
            "position": position,
            "position_rank": self.position_counts[position],
            "overall": self.current_pick["overall"],
            "show": True
        })

        self.position_counts[position] = self.position_counts[position] + 1
        self.__save()
        self.__advance_pick()
    
    def __advance_pick(self):
        if self.current_pick["overall"] < self.total_picks:
            if self.current_pick["number"] == self.num_teams:
                self.current_pick["round"] = self.current_pick["round"] + 1
                self.current_pick["number"] = 1
            else:
                self.current_pick["number"] = self.current_pick["number"] + 1
            self.current_pick["overall"] = self.current_pick["overall"] + 1

            self.reset_timer()
            if hasattr(self, "timer"):
                self.timer.join()
            self.start_timer()
        
        # finish draft
        else:
            self.complete = True

    def get_current_team(self):
        if self.current_pick["round"] % 2 == 1:
            return self.teams[self.current_pick["number"] - 1]
        else:
            return self.teams[self.num_teams - self.current_pick["number"]]
        
    def __save(self):
        with open("save.csv", "w") as savefile:
            writer = csv.writer(savefile)
            for i in range(self.current_pick["round"]):
                writer.writerow(self.picks[i])

    def start_timer(self):
        if not self.clock_running:
            self.clock_running = True
            self.timer = Thread(target=self.__timer, daemon=True)
            self.timer.start()

    def stop_timer(self): 
        self.clock_running = False

    def resume_timer(self):
        if not self.clock_running:
            self.clock_running = True

    def toggle_timer(self):
        if self.clock_running:
            self.stop_timer()
        else:
            self.start_timer()

    def reset_timer(self):
        self.time_on_clock = self.time_per_pick

    def __timer(self):
        while self.clock_running and self.time_on_clock > 0:
            time.sleep(1)
            self.time_on_clock = self.time_on_clock - 1
