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
    update(noteId, text) {
      return $http.put(`${baseUrl}/notes/${noteId}`, {text})
        .then(response => response.data);
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
      <form>
        <label>
          {{$ctrl.labelText}}
          <input ng-model="$ctrl.newNote" />
        </label>
        <input type="submit" ng-click="$ctrl.addNote()">
      </form>
      <div>{{$ctrl.error}}</div>
      <div ng-if="!$ctrl.notes && !$ctrl.error">
        loading...
      </div>
      <ul>
        <li ng-repeat="note in $ctrl.notes">
          <input
            ng-model="note.text"
            ng-blur="$ctrl.updateNote(note)"
          >
          </span>
          <button ng-click="$ctrl.deleteNote(note.id)">x</button>
        </li>
      </ul>
    </div>
  `,
})

.controller("NoteListCtrl", function NoteListCtrl(NotesService) {
  const ctrl = this;
  ctrl.notes = null;
  ctrl.newNote = "";
  ctrl.error = "";

  const showError = response => {
    ctrl.error = response.data?.error ?? response.xhrStatus;
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

  ctrl.updateNote = note =>
    NotesService
      .update(note.id, note.text)
      .then(() => ctrl.getNotes())
      .catch(showError);

  ctrl.deleteNote = noteId =>
    NotesService
      .delete(noteId)
      .then(() => ctrl.getNotes())
      .catch(showError);

  ctrl.getNotes().catch(showError);
});
