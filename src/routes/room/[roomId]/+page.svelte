<script>
	// @ts-nocheck

	import { io } from 'socket.io-client';
	import {
		Button,
		Modal,
		Form,
		FormGroup,
		Checkbox,
		RadioButtonGroup,
		RadioButton,
		Select,
		SelectItem,
		TextInput,
		MultiSelect,
		NumberInput,
		Grid,
		Column,
		Row,
		ToastNotification
	} from 'carbon-components-svelte';
	import Send from 'carbon-icons-svelte/lib/Send.svelte';
	import { okzoomer, gestureToMatrix, getOrigin, applyMatrix } from '$lib/ok-zoomer';
	import { formatTime } from '$lib/utils';

	/** @type {import('./$types').PageData} */
	export let data;
	let cellData = null;

	/** @type {number?} */
	let waitingTime = null;

	let open = true;
	/** @type {HTMLDivElement} */
	let selectedCell = null;
	let socket;

	let backend_uri = '',
		username = '';

	/** @type {any} */
	let config = { roomId: data.roomId };
	$: config.backend_uri =
		backend_uri[backend_uri.length - 1] == '/'
			? backend_uri.slice(0, backend_uri.length - 1)
			: backend_uri;

	function connect() {
		let origin;
		let initial_ctm = new DOMMatrix();
		let el = document.querySelector('#bitmap');
		el.style.transformOrigin = '0 0';

		okzoomer(document.querySelector('.bitmap-main'), {
			startGesture(gesture) {
				/*
						Clear the element's transform so we can 
						measure its original position wrt. the screen.
						(We don't need to restore it because it gets 
						overwritten by `applyMatrix()` anyways.)
					 */
				el.style.transform = '';
				origin = getOrigin(el, gesture);
				applyMatrix(el, gestureToMatrix(gesture, origin).multiply(initial_ctm));
			},
			doGesture(gesture) {
				applyMatrix(el, gestureToMatrix(gesture, origin).multiply(initial_ctm));
			},
			endGesture(gesture) {
				initial_ctm = gestureToMatrix(gesture, origin).multiply(initial_ctm);
				applyMatrix(el, initial_ctm);
			}
		});

		socket = io(`${config.backend_uri}/room/${config.roomId}`);
		socket.on('connect', () => {
			console.log({ id: socket.id });
		});

		socket.on('init', (data) => {
			console.log({ initData: data });
			cellData = data;
			// let pixels = data.pixels;
			// Object.keys(pixels).forEach((row) => {
			// 	Object.keys(pixels[row]).forEach((column) => {
			// 		document.querySelector(
			// 			`[data-row="${row}"][data-column="${column}"]`
			// 		).style.backgroundColor = pixels[row][column];
			// 	});
			// });
		});

		socket.on('pixel-update', (...args) => {
			let data = args[0];
			console.log({ data: data });
			let { row, column, color } = data;
			let cell = document.querySelector(`[data-row="${row}"][data-column="${column}"]`);
			tempChangeColor(cell, color, true);
		});

		socket.on('wait', (data) => {
			waitingTime = data.waitTime;
		});

		open = false;
	}

	/**
	 * @param  {HTMLDivElement} el
	 * @param  {string} color
	 */
	function tempChangeColor(el, color, perm = false) {
		let defaultBgColor = el.style.backgroundColor;
		el.style.backgroundColor = color;
		if (perm) {
			el.style.backgroundColor = color;
			return;
		}
		setTimeout(() => {
			el.style.backgroundColor = defaultBgColor;
		}, 2000);
	}

	function handleCellClick(cell) {
		if (selectedCell == cell) {
			unHighlightCell(selectedCell);
			return;
		}
		if (selectedCell != null) {
			unHighlightCell(selectedCell);
		}
		selectedCell = cell;
		selectedCell.classList.add('highlight');
	}

	function unHighlightCell(cell) {
		cell.classList.remove('highlight');
		selectedCell = null;
	}

	function handleColorBtnClick(colorBtn) {
		if (selectedCell == null) return;
		socket.emit('pixel-put', {
			row: selectedCell.dataset.row,
			column: selectedCell.dataset.column,
			colorId: colorBtn.dataset.colorId
		});
		unHighlightCell(selectedCell);
	}
</script>

{#if waitingTime}
	<ToastNotification
		style="z-index: 100;"
		title="Timeout"
		kind="warning"
		timeout={5000}
		fullWidth={true}
		subtitle={`Wait for ${formatTime(waitingTime)}`}
	/>
{/if}

<Modal
	bind:open
	modalHeading="Configuration"
	primaryButtonText="Save"
	secondaryButtonText="Cancel"
	primaryButtonIcon={Send}
	on:click:button--secondary={() => (open = false)}
	preventCloseOnClickOutside
	on:open
	on:close
	on:submit={connect}
>
	<Form on:submit>
		<FormGroup>
			<TextInput bind:value={username} labelText="Username" placeholder="karaoke127" />
		</FormGroup>
		<FormGroup>
			<TextInput
				bind:value={backend_uri}
				labelText="Backend URL"
				placeholder="http://172.70.106.95:3000"
			/>
		</FormGroup>
	</Form>
</Modal>
<div class="bitmap-view-box">
	<div class="bitmap-main">
		<div id="bitmap">
			{#if cellData}
				<div
					class="gen-grid"
					style={`grid-template-columns: repeat(${cellData.gridSize.column}, 1fr); grid-template-rows: repeat(${cellData.gridSize.rows}, 1fr);`}
				>
					{#each Array.from({ length: cellData.gridSize.row }) as _r, rowInd}
						{#each Array.from({ length: cellData.gridSize.column }) as _c, columnInd}
							<button
								class="cell"
								data-row={rowInd}
								data-column={columnInd}
								style={`background-color: ${cellData?.pixels?.[rowInd]?.[columnInd]}`}
								on:click={(e) => handleCellClick(e.currentTarget)}
							/>
						{/each}
					{/each}
				</div>
			{/if}
		</div>
	</div>
	<div class="bitmap-toolbar">
		{#if cellData}
			<div class="color-palette">
				{#each cellData.colors as color, ind}
					<button
						data-color-id={ind}
						class="color"
						style={`background-color: ${color}`}
						on:click={(e) => handleColorBtnClick(e.currentTarget)}
					>
						<span class="color-text">{color}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.gen-grid {
		display: grid;
		z-index: 10;
	}
</style>
