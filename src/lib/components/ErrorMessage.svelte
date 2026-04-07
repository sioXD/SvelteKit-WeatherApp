<script lang="ts">
	interface Props {
		message: string;
		onDismiss?: () => void;
	}

	let { message, onDismiss }: Props = $props();
</script>

<div class="error-container">
	<div class="error-content">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<line x1="15" y1="9" x2="9" y2="15"></line>
			<line x1="9" y1="9" x2="15" y2="15"></line>
		</svg>
		<p>{message}</p>
	</div>
	{#if onDismiss}
		<button class="dismiss-button" onclick={onDismiss} title="Fehler schließen">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	{/if}
</div>

<style>
	.error-container {
		background: rgba(239, 68, 68, 0.15);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 16px;
		padding: 1.5rem;
		margin: 1rem auto;
		max-width: 600px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		animation: slideIn 0.3s ease;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.error-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}

	.error-content svg {
		flex-shrink: 0;
		color: rgb(239, 68, 68);
	}

	.error-content p {
		margin: 0;
		font-size: 1rem;
		color: inherit;
	}

	.dismiss-button {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 8px;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		color: inherit;
		flex-shrink: 0;
	}

	.dismiss-button:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	@media (max-width: 640px) {
		.error-container {
			padding: 1rem;
		}

		.error-content p {
			font-size: 0.875rem;
		}
	}
</style>
