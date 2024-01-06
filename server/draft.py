from copy import deepcopy

class Draft:

    def __init__(self, num_rounds: int, teams: list[str]):
        self.num_rounds = num_rounds
        self.teams = teams
        self.num_teams = len(teams)

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

    def make_pick(self, name: str, team: str, position: str):

        r = self.current_pick["round"] - 1
        n = self.current_pick["number"] - 1 if self.current_pick["round"] % 2 == 1 else self.num_teams - self.current_pick["number"]

        self.picks[r][n].update({
            "name": name,
            "team": team,
            "position": position,
            "position_rank": self.position_counts[position],
            "show": True
        })

        self.position_counts[position] = self.position_counts[position] + 1
        self.__advance_pick()
    
    def __advance_pick(self):
        if self.current_pick["number"] == self.num_teams:
            self.current_pick["round"] = self.current_pick["round"] + 1
            self.current_pick["number"] = 1
        else:
            self.current_pick["number"] = self.current_pick["number"] + 1
        self.current_pick["overall"] = self.current_pick["overall"] + 1

    def get_current_team(self):
        if self.current_pick["round"] % 2 == 1:
            return self.teams[self.current_pick["number"] - 1]
        else:
            return self.teams[self.num_teams - self.current_pick["number"]]