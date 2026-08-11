export async function loadManifest() {
  const res = await fetch('/manifest.json');
  if (!res.ok) throw new Error('Could not load manifest.');
  return res.json();
}
