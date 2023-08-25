<script>
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
		InlineNotification
	} from 'carbon-components-svelte';
	import Send from 'carbon-icons-svelte/lib/Send.svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import { goto } from '$app/navigation';
	/** @type {any} */
	let formData,
		/** @type {string} */ backend_uri = 'https://socket-pixels-server.onrender.com',
		/** @type {number} */ timeout = 10000,
		/** @type {Array<string>} */ colors = [],
		/** @type {string} */ gridSize = '10x10';
	$: formData = {
		backendURL: backend_uri,
		timeout,
		colors,
		gridSize: { row: gridSize.split('x')[0], column: gridSize.split('x')[1] }
	};

	let colorOptions = [
		'#6d001a',
		'#be0039',
		'#ffa800',
		'#ffd635',
		'#00a368',
		'#7eed56',
		'#00756f',
		'#009eaa',
		'#00ccc0',
		'#2450a4',
		'#493ac1',
		'#94b3ff',
		'#811e9f',
		'#de107f',
		'#6d482f',
		'#ffb470',
		'#000000',
		'#515252',
		'#898d90',
		'#ffffff'
	];

	let open = false;
	let loading = false;
	let errorMessage = '';

	function addColor() {
		/** @type {string} */
		let newColor;
		// @ts-ignore
		newColor = document.getElementById('color-select').value;
		if (newColor == '') return;
		colorOptions = [...colorOptions, newColor.toLowerCase()];
	}

	async function createRoom() {
		if (!(backend_uri && timeout && colors.length > 0)) {
			errorMessage = 'Please fill in all required fields.';
			return;
		}
		loading = true;
		errorMessage = '';
		try {
			let res = await fetch(
				`${
					backend_uri[backend_uri.length - 1] == '/'
						? backend_uri.slice(0, backend_uri.length - 1)
						: backend_uri
				}/createroom`,
				{
					method: 'POST',
					body: JSON.stringify(formData)
				}
			);
			let data = await res.json();
			if (data?.success) {
				errorMessage = 'An error occurred while creating the room.';
				loading = false;
				console.log({ data });
				// Good to redirect
				goto(`/room/${data.data.roomId}`);
			}
		} catch (error) {
			errorMessage = 'An error occurred while creating the room.';
			loading = false;
		}
	}
</script>

<main>
	<section class="hero is-fullheight is-info">
		<div class="hero-body">
			<div class="container has-text-centered">
				<h1 class="title is-spaced">r/place canvas clone</h1>
				<h2 class="subtitle">built using socket.io</h2>
				<Button on:click={() => (open = true)}>Create Room</Button>
				<Modal
					bind:open
					modalHeading="Create a new room"
					primaryButtonText="Confirm"
					secondaryButtonText="Cancel"
					primaryButtonIcon={Send}
					on:click:button--secondary={() => (open = false)}
					on:open
					on:close
					on:submit={createRoom}
				>
					<Form on:submit>
						<FormGroup>
							<TextInput
								bind:value={backend_uri}
								labelText="Backend URL"
								placeholder="https://socket-pixels-server.onrender.com"
							/>
						</FormGroup>
						<FormGroup>
							<RadioButtonGroup bind:selected={gridSize} legendText="Grid Size">
								<RadioButton labelText="5x5" value="5x5" />
								<RadioButton labelText="10x10" value="10x10" />
								<RadioButton labelText="15x15" value="15x15" />
							</RadioButtonGroup>
						</FormGroup>
						<FormGroup>
							<NumberInput
								min={1000}
								max={1800000}
								bind:value={timeout}
								invalidText="Time must be between 10 seconds and 30 minutes"
								step={1000}
								helperText="Time user must wait between 2 inputs"
								label="Timeout (1s to 30min)"
							/>
						</FormGroup>
						<FormGroup>
							<Grid>
								<Row
									style="display: grid; align-items: end; grid-template-columns: 1fr min-content;"
								>
									<Column>
										<MultiSelect
											id="color-select"
											spellcheck="false"
											filterable
											titleText="Colors"
											placeholder="Select Colors"
											items={colorOptions.map((color) => ({ id: color, text: color }))}
											on:select={(e) => (colors = e.detail.selectedIds)}
											let:item
											let:index
										>
											<Grid class="color-option">
												<div>
													<strong>{item.text}</strong>
												</div>
												<div class="color-option-color" style={`background-color: ${item.text};`} />
											</Grid>
										</MultiSelect>
									</Column>
									<Column>
										<Button
											on:click={addColor}
											kind="primary"
											iconDescription="Add custom color"
											icon={Add}
										/>
									</Column>
								</Row>
							</Grid>
						</FormGroup>
						{#if errorMessage}
							<InlineNotification kind="error" subtitle={errorMessage} />
						{/if}
					</Form>
				</Modal>
			</div>
		</div>
	</section>
</main>

<style>
	:global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
		height: auto;
	}

	:global(.bx--checkbox-label-text) {
		display: block;
	}
	:global(.color-option) {
		display: grid;
		grid-template-columns: 1fr 2rem;
	}
	.color-option-color {
		width: 100%;
	}
</style>
