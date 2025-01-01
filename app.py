import sys
import json
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room
from room import Player, Lobby, Plays

app = Flask(__name__)
socketio = SocketIO(app)
state = Lobby()
plays = Plays()


# /play
@socketio.on("connect", namespace="/play")
def connection():
    session = json.loads(request.cookies["session"])
    plays.add(session["room"], state.players_names(session["room"]))
    print(f"{request.sid} connected in /play!", file=sys.stdout)
    join_room(room=session["room"], namespace="/play")
    next = plays.next(session["room"])
    print(f"Turn: {next}")
    emit("turn", next, to=session["room"], broadcast=True, namespace="/play")

@socketio.on("cross", namespace="/play")
def cross(number):
    session = json.loads(request.cookies["session"])
    emit("cross", number, to=session["room"], broadcast=True, namespace="/play")
    emit("turn", plays.next(session["room"]), to=session["room"], broadcast=True, namespace="/play")

@socketio.on("winner", namespace="/play")
def result(winner):
    session = json.loads(request.cookies["session"])
    emit("winner", winner, to=session["room"], broadcast=True, namespace="/play")
    state.remove(session["room"])
    plays.remove(session["room"])

# /lobby
@socketio.on("connect", namespace="/lobby")
def lobby_connect(auth=None):
    session = json.loads(request.cookies["session"])
    state.add(session["room"], Player(request.sid, session["name"]))
    join_room(room=session["room"], namespace="/lobby")
    print(f"{request.sid} is connected in /lobby", file=sys.stdout)
    emit("master", state.master(session["room"]).name, to=session["room"], broadcast = True)
    emit("players", json.dumps(state.players_names(session["room"])), to=session["room"], broadcast = True)

@socketio.on("start", namespace="/lobby")
def lobby_start():
    session = json.loads(request.cookies["session"])
    print(f"{request.sid} starts the game.")
    emit("start", to=session["room"], broadcast = True)

# html stuff
@app.get("/")
def login():
    return render_template("login.html")

@app.get("/winner")
def winner():
    return render_template("winner.html")

@app.get("/loser")
def loser():
    return render_template("loser.html")

@app.get("/lobby")
def lobby():
    return render_template("lobby.html")

@app.get("/play")
def play():
    return render_template("play.html")

if __name__ == "__main__":
    socketio.run(app)
