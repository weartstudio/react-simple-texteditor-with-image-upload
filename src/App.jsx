import React, { useState, useRef, useEffect } from "react";
import { Editor, EditorProvider } from "react-simple-wysiwyg";

const App = () => {
	const [html, setHtml] = useState("<p>Szerkeszd itt a tartalmat</p>");
	const editorWrapperRef = useRef(null);
	const editableRef = useRef(null); // tartalmazza majd a belső szerkesztő DOM elemet

	// Betöltés után keressük meg a contentEditable mezőt
	useEffect(() => {
		if (editorWrapperRef.current) {
			const editable = editorWrapperRef.current.querySelector('[contenteditable="true"]');
			editableRef.current = editable;
		}
	}, []);

	const handleHtmlChange = (e) => {
		setHtml(e.target.value);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result;
			const imgTag = `<img src="${base64}" alt="Uploaded Image" style="max-width: 100%; margin-top: 1em;" />`;
			setHtml((prevHtml) => prevHtml + imgTag);
		};
		reader.readAsDataURL(file);
	};

	// Művelet futtatása a belső editoron
	const exec = (command, value = null) => {
		editableRef.current?.focus(); // fókusz kell a parancs futtatásához
		document.execCommand(command, false, value);
	};

	return (
		<EditorProvider>
			<div className="left">
				<h3>
					<i class="bi bi-pen"></i> Szövegszerkesztő
				</h3>

				{/* 🛠 Toolbar */}
				<div className="toolbar">
					{/* bold */}
					<button onClick={() => exec("bold")}>
						<i class="bi bi-type-bold"></i>
					</button>

					{/* italic */}
					<button onClick={() => exec("italic")}>
						<i class="bi bi-type-italic"></i>
					</button>

					{/* underline */}
					<button onClick={() => exec("underline")}>
						<i class="bi bi-type-underline"></i>
					</button>

					{/* • Lista */}
					<button onClick={() => exec("insertUnorderedList")}>
						<i class="bi bi-list-ul"></i>
					</button>

					{/* 1. Lista */}
					<button onClick={() => exec("insertOrderedList")}>
						<i class="bi bi-list-ol"></i>
					</button>

					{/* link */}
					<button
						onClick={() => {
							const url = prompt("Link URL:");
							if (url) exec("createLink", url);
						}}
					>
						<i class="bi bi-link"></i>
					</button>

					{/* formázás törlés */}
					<button onClick={() => exec("removeFormat")}>
						<i class="bi bi-trash3"></i>
					</button>
				</div>
				<div style={{ margin: "1rem" }}>
					<label>
						<strong>Kép beillesztése:</strong> <input type="file" accept="image/*" onChange={handleImageUpload} />
					</label>
				</div>

				{/* ✍️ Editor */}
				<div ref={editorWrapperRef}>
					<Editor value={html} onChange={handleHtmlChange} />
				</div>

				{/* 📷 Kép feltöltés */}
			</div>

			<div className="right">
				{/* 👀 Előnézet */}
				<div style={{ marginTop: "2rem" }}>
					<h3>
						<i class="bi bi-filetype-html"></i> HTML Előnézet:
					</h3>
					<div dangerouslySetInnerHTML={{ __html: html }} />
				</div>
			</div>
		</EditorProvider>
	);
};

export default App;
