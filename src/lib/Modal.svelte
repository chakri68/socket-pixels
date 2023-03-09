<script>
	/** @type {string} */
	export let id;
	/** @type {string} */
	export let triggerText;
	/** @type {string} */
	export let triggerClass;

	export let openModal = (/** @type {string} */ id) => {
		document.getElementById(id)?.classList.add('is-active');
	};
	export let closeModal = (/** @type {string} */ id) => {
		document.getElementById(id)?.classList.remove('is-active');
	};
</script>

<button class={`js-modal-trigger ${triggerClass}`} on:click={() => openModal(id)}
	>{triggerText}</button
>

<div {id} class="modal">
	<div class="modal-background" on:click={() => closeModal(id)} on:keydown={() => closeModal(id)} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title"><slot name="title">Title</slot></p>
			<button class="delete" aria-label="close" on:click={() => closeModal(id)} />
		</header>
		<section class="modal-card-body has-text-black">
			<slot name="body">Body</slot>
		</section>
		<footer class="modal-card-foot">
			<slot name="footer">
				<button class="button is-success">Save changes</button>
				<button class="button">Cancel</button>
			</slot>
		</footer>
	</div>
</div>
