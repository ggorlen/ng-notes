# ng-notes

Simple note app to learn AngularJS.


## Backend Installation

```
git clone https://github.com/ggorlen/ng-notes.git
cd ng-notes

# optionally create a venv
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python3 app.py
```

The site should be running at <http://localhost:5000>


## Notes JSON API Documentation

- `GET /api/notes`: get all notes
  - response: `{"notes": [{"id": 1, "text": "hello world"}]}`, 200
- `GET /api/notes/<id>`: get one note by id
  - response: `{"id": 1, "text": "hello world"}`, 200
  - error response: `{"error": "Not found"}`, 404
- `POST /api/notes`: create a new note
  - request format: `{"text": "hello world"}`
  - response: `{"id": 1, "text": "hello world"}`, 201
  - error response: `{"error": "Missing key 'text'"}`, 422
- `PUT /api/notes/<id>`: update an existing note
  - request format: `{"id": 1, "text": "goodbye world"}`
  - response: `{"id": 1, "text": "goodbye world"}`, 200
  - error response: `{"error": "Missing key 'text'"}`, 422
  - error response: `{"error": "Not found"}`, 404
- `DELETE /api/notes/<id>`: delete one note by id
  - response: `{"message": "Successfully deleted"}`, 200
  - error response: `{"error": "Not found"}`, 404
