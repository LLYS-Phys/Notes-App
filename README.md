# Notes App

A simple notes app constructed using React and Vite. Please note that only frontend functionalities are implemented.
This app allows you to:
- Create Notes
- Delete Notes
- Search for notes by their name or their content

Notes consist of:
- Title
- Text inside the note
- Automatically generated timestamp when save event is triggered (the format of the timestamp is dd/mm/yyyy hh:mm)

Additional Information:
- You can browse through notes in the sidebar on the left which visibility can be toggled. Notes are recorded in reverse chronological order (the newest notes are on top of the list).
- Functinality buttons on the page are disabled and enabled depending on the user interaction, so that only the buttons that can perform an action in the given moment are active.
- When both the title and the text of the note have at least 1 symbol, the user can save it by simply pressing "Enter". A new row can be added in the text of the note by the key combination "Shift+Enter".
- On mobile devices right swipe on the screen toggles the sidebar open and a left swipe toggles it close.
