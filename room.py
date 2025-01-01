class Player:
    def __init__(self, id: str, name: str) -> None:
        self.id = id
        self.name = name

class Room:
    def __init__(self, master: Player) -> None:
        self.master = master
        self.members = dict()
        self.add(master.id, master)

    def add(self, id, player: Player):
        self.members[id] = player

    def players(self):
        return self.members.values()

class Lobby:
    def __init__(self) -> None:
        self.lobby = dict()

    def add(self, name: str, player: Player):
        if name in self.lobby:
            self.lobby[name].add(player.id, player)
        else:
            self.lobby[name] = Room(player)

    def remove(self, name: str):
        del self.lobby[name]

    def players(self, name: str):
        return self.lobby[name].players()

    def players_names(self, name):
        names = []
        for player in self.players(name):
            names.insert(0, player.name)
        return names

    def master(self, name: str):
        return self.lobby[name].master

class Plays:
    def __init__(self) -> None:
        self.plays = {}

    def add(self, room: str, members: list):
        members.sort()
        self.plays[room] = {"turn":0, "members": members}

    def remove(self, room: str):
        del self.plays[room]

    def next(self, room: str):
        turn = self.plays[room]["turn"]
        self.plays[room]["turn"] += 1
        members = self.plays[room]["members"]
        return members[turn % len(members)]