const fs = require("fs");
const targetFile = fs.readdirSync(__dirname).find((f) => f.endsWith(".json"));
if (!targetFile) {
	console.log("[Black note remover] No song data (.json) found. Please place the .json file in the same directory as this script.");
	return;
}
const chart = JSON.parse(fs.readFileSync(targetFile, "utf-8").replace(/\r|\n/, ""));
const { ignoreNotes, space } = require("./config.json");
let amount = 0;
if (!chart?.song?.notes) {
	console.log("[Black note remover] Failed to parse the song data, please make sure the song data (.json) is valid.");
	return;
}
for (let i = 0; i < chart.song.notes.length; i++) {
	const notes = chart.song.notes[i];
	if (!notes?.sectionNotes) continue;
	for (let i = 0; i < notes.sectionNotes.length; i++) {
		if (notes.sectionNotes[i].length > 3 && !ignoreNotes.includes(notes.sectionNotes[i][3])) {
			notes.sectionNotes.splice(i, 1);
			i--;
			amount++;
		}
	}
	chart.song.notes[i] = notes;
}
console.log("[Black note remover] Removed " + amount + " black notes from " + targetFile);
fs.writeFileSync("[modified] " + targetFile, JSON.stringify(chart, null, space));
