from flask import Flask, render_template, request


def id_maker(_identifier=0):
    def next_id():
        nonlocal _identifier
        _identifier += 1
        return _identifier

    return next_id


app = Flask(__name__)
next_id = id_maker()
_notes = [{"id": next_id(), "text": "test 1"}]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/notes", methods=["GET", "POST"])
def notes():
    if request.method == "GET":
        return {"notes": _notes}
    elif "text" not in request.json:
        return {"error": "Missing key 'text'"}, 422

    note = {"id": next_id(), "text": request.json["text"]}
    _notes.append(note)
    return note, 201


@app.route("/api/notes/<int:note_id>", methods=["GET", "DELETE"])
def note(note_id):
    if request.method == "GET":
        if note := [x for x in _notes if x["id"] == note_id]:
            return next(note)

        return {"error": "Not found"}, 404

    idx = [i for i, x in enumerate(_notes) if x["id"] == note_id]

    if not idx:
        return {"error": "Not found"}, 404

    _notes.pop(idx[0])
    return {"message": "Successfully deleted"}, 204


if __name__ == "__main__":
    app.run(debug=True)

