import React, { useState, useRef, useEffect } from "react";
import { Editor, EditorProvider } from "react-simple-wysiwyg";

const App = () => {
	const [html, setHtml] = useState("<p>Szerkeszd itt a tartalmat</p>");
	const editorWrapperRef = useRef(null);
	const editableRef = useRef(null);

	// load után a editor betöltése refbe
	useEffect(() => {
		if (editorWrapperRef.current) {
			const editable = editorWrapperRef.current.querySelector('[contenteditable="true"]');
			editableRef.current = editable;
		}
	}, []);

	// tartalom mentése
	const handleHtmlChange = (e) => {
		setHtml(e.target.value);
	};

	// kép felötlés kezelése (base64)
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result;
			const imgTag = `<img src="${base64}" alt="Feltöltött kép" style="max-width: 100%; margin-top: 1em;" />`;
			setHtml((prevHtml) => prevHtml + imgTag);
		};
		reader.readAsDataURL(file);
	};

	// formázások végrehajtása
	const exec = (command, value = null) => {
		editableRef.current?.focus();
		document.execCommand(command, false, value);
	};

	return (
		<EditorProvider>
			<div className="left">
				<h3>
					<i class="bi bi-pen"></i> Szövegszerkesztő
				</h3>

				{/* Formázások */}
				<div className="toolbar">
					{/* félkövér */}
					<button onClick={() => exec("bold")}>
						<i class="bi bi-type-bold"></i>
					</button>

					{/* dőlt */}
					<button onClick={() => exec("italic")}>
						<i class="bi bi-type-italic"></i>
					</button>

					{/* aláhúz */}
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

				{/* Képfeltöltés */}
				<div style={{ margin: "1rem" }}>
					<label>
						<strong>Kép beillesztése:</strong> <input type="file" accept="image/*" onChange={handleImageUpload} />
					</label>
				</div>

				{/* Editor */}
				<div ref={editorWrapperRef}>
					<Editor value={html} onChange={handleHtmlChange} />
				</div>
			</div>

			<div className="right">
				{/* HTML Előnézet */}
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
