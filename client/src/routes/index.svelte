<script lang="ts">
	import Title from '$components/Title.svelte';
	import Form from '$components/Form.svelte';
	import Responses from '$components/Responses.svelte';
</script>

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.output {
		position: absolute;
		top: 175px;
		width: 100%;
	}

	.content {
		position: relative;
		width: 80%;
	}

	@media (min-width: 800px) {
		.content {
			width: 40%;
		}
	}
</style>

<main>
	<div class="content">
		<Title/>
		<Form/>
		<div class="output">
			<Responses/>
		</div>
	</div>
</main>