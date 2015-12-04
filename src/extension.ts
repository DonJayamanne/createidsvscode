// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as shortid from 'shortid';
// import * as uuid from 'uuid';
// import * as copypaste from 'copy-paste'
// import * as Random from 'random-js';

enum randomIdType {
	ShortId,
	UUID,
	Number
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var shortid = require('shortid');
	var uuid = require('uuid');
	var copypaste = require('copy-paste');
	var Random = require('random-js');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "createuniqueids" is now active!');
	var random;
	var minimumNumber = 0;
	var maximumNumber = 100;
	function captureMinimumNumber() {
		vscode.window.showInputBox({ placeHolder: "Number", prompt: "Enter the minimum number for the range", value: "0" }).then(value=> {
			if (typeof value !== "string") {
				return;
			}
			minimumNumber = parseInt(value);
			if (isNaN(minimumNumber)) {
				return;
			}
			captureMaximumNumber();
		});
	}
	function captureMaximumNumber() {
		vscode.window.showInputBox({ placeHolder: "Number", prompt: "Enter the maximum number for the range", value: "100" }).then(value=> {
			if (typeof value !== "string") {
				return;
			}
			maximumNumber = parseInt(value);
			if (isNaN(maximumNumber)) {
				return;
			}
			generateRandomNumberAndDisplay();
		});
	}
	function generateRandomNumberAndDisplay() {
		var minNum = minimumNumber < maximumNumber ? minimumNumber : maximumNumber;
		var maxNum = minimumNumber > maximumNumber ? minimumNumber : maximumNumber;
		random = random || new Random(Random.engines.mt19937().autoSeed());
		var value = random.integer(minNum, maxNum);
		displayResult(value.toString());
	}
	function displayResult(value: string) {
		var args = [value, "Copy"];
		var activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
			args.push("Insert");
		}

		vscode.window.showInformationMessage.apply(vscode.window, args).then((cmd) => {
			if (cmd === "Copy") {
				copypaste.copy(value);
			}
			if (cmd === "Insert") {
				var activeEditor = vscode.window.activeTextEditor;
				if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
					activeEditor.edit((editor) => {
						editor.insert(activeEditor.selection.active, value);
					});
				}

			}
		});
	}
	function generate(code: randomIdType) {
		if (code === randomIdType.Number) {
			captureMinimumNumber();
			return;
		}

		var value: string = (code === randomIdType.ShortId) ? shortid.generate() : uuid.v4();
		displayResult(value);
	}
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.generateuniqueid', () => {
		// The code you place here will be executed every time your command is executed
		//var shortIdValue = shortid.generate();
		//var uuid4Value = uuid.v4();

		var items = [{ label: "Generate a Short Id, example = '23TplPdS'", description: "", code: randomIdType.ShortId },
			{ label: "Generate a UUID/GUID, example = '110ec58a-a0f2-4ac4-8393-c866d813b8d1'", description: "", code: randomIdType.UUID },
			{ label: "Generate a random number", description: "", code: randomIdType.Number }];

		vscode.window.showQuickPick(items).then(item=> generate(item.code));
	});

	context.subscriptions.push(disposable);
}