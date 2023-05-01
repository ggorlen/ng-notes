angular.module("notesApp", []);

angular
.module("notesApp")
.constant("baseUrl", "http://localhost:5000/api")

.factory("NotesService", function ($http, baseUrl) {
  return {
    add(note) {
      return $http.post(`${baseUrl}/notes`, {text: note})
        .then(response => response.data);
    },
    get() {
      return $http.get(`${baseUrl}/notes`)
        .then(response => response.data.notes);
    },
    delete(noteId) {
      return $http.delete(`${baseUrl}/notes/${noteId}`)
        .then(response => response.data);
    },
  };
})

.component("noteList", {
  bindings: {
    labelText: "@",
  },
  controller: "NoteListCtrl",
  controllerAs: "$ctrl",
  template: `
    <div>
      <label>
        {{$ctrl.labelText}}
        <input ng-model="$ctrl.newNote" />
      </label>
      <button ng-click="$ctrl.addNote()">add note</button>
      <div>{{$ctrl.error}}</div>
      <ul>
        <div ng-if="!$ctrl.notes && !error">
          loading...
        </div>
        <li ng-repeat="note in $ctrl.notes">
          <span>{{note.text}}</span>
          <button ng-click="$ctrl.deleteNote(note.id)">x</button>
        </li>
      </ul>
    </div>
  `,
})

.controller("NoteListCtrl", function NoteListCtrl($http, NotesService) {
  const ctrl = this;
  ctrl.notes = null;
  ctrl.newNote = "";
  ctrl.error = "";

  const showError = err => {
    ctrl.error = err.xhrStatus;
  };

  ctrl.getNotes = () =>
    NotesService
      .get()
      .then(notes => {
        ctrl.notes = notes;
      });

  ctrl.addNote = () =>
    NotesService
      .add(ctrl.newNote)
      .then(() => {
        ctrl.newNote = "";
        return ctrl.getNotes();
      })
      .catch(showError);

  ctrl.deleteNote = noteId =>
    NotesService
      .delete(noteId)
      .then(() => ctrl.getNotes())
      .catch(showError);

  ctrl.getNotes().catch(showError);
});
