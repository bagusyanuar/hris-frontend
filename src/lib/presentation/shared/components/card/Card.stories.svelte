<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';

  const { Story } = defineMeta({
    title: 'Card',
    component: Card
  });
</script>

<script lang="ts">
  import Button from '../button/Button.svelte';
  import Typography from '../typography/Typography.svelte';
</script>

<Story name="Default">
  <Card title="Card Title" description="This is a simple card description.">
    <Typography variant="body-sm">
      This is the body content of the card. You can put anything here.
    </Typography>
  </Card>
</Story>

<Story name="Interactive / Hoverable">
  <Card title="Interactive Card" description="Hover over me to see effect" hoverable={true}>
    <Typography variant="body-sm">
      This card has custom hover states, animations, and shadows.
    </Typography>
  </Card>
</Story>

<Story name="With Footer & Header snippet">
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between w-full">
        <Typography variant="h6" weight="bold">Custom Header</Typography>
        <span class="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-text"
          >Active</span
        >
      </div>
    {/snippet}

    <Typography variant="body-sm">Inside content of the card goes here.</Typography>

    {#snippet footer()}
      <div class="flex justify-end gap-2 w-full">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </div>
    {/snippet}
  </Card>
</Story>

<Story name="Accent Borders">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card
      variant="accent-primary"
      title="Primary Accent"
      description="Highlighting important items"
    >
      <Typography variant="body-sm"
        >This card highlights content with the primary brand color border on the left.</Typography
      >
    </Card>

    <Card
      variant="accent-success"
      title="Success Accent"
      description="Operation completed successfully"
    >
      <Typography variant="body-sm"
        >Used for approved requests, active accounts, or completed tasks.</Typography
      >
    </Card>

    <Card variant="accent-warning" title="Warning Accent" description="Pending review needed">
      <Typography variant="body-sm"
        >Used for items requiring attention or pending approval states.</Typography
      >
    </Card>

    <Card
      variant="accent-danger"
      title="Danger Accent"
      description="Critical error or rejected state"
    >
      <Typography variant="body-sm"
        >Used for rejected submissions, system errors, or inactive statuses.</Typography
      >
    </Card>
  </div>
</Story>

<Story name="Glassmorphism">
  <div
    class="p-6 bg-gradient-to-tr from-brand-primary/20 via-sky-500/10 to-indigo-500/20 rounded-2xl"
  >
    <Card variant="glass" title="Glassmorphism Card" description="Beautiful frosted glass effect">
      <Typography variant="body-sm">
        Perfect for floating overlays, quick-action widgets, or components rendered over rich
        media/gradient backgrounds.
      </Typography>
    </Card>
  </div>
</Story>

<Story name="Glowing & Gradient">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card
      variant="glow"
      title="Glow on Hover"
      description="Interactive glowing shadow"
      hoverable={true}
    >
      <Typography variant="body-sm">
        Hover over this card to see a premium, soft brand-colored glow animation radiating from the
        borders.
      </Typography>
    </Card>

    <Card
      variant="gradient"
      title="Gradient Background"
      description="Sleek brand background gradient"
    >
      <Typography variant="body-sm">
        Uses a very light brand-themed background gradient to pop out from standard cards without
        feeling overwhelming.
      </Typography>
    </Card>
  </div>
</Story>
