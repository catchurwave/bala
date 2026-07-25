const BASE = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function repoUrl(path: string) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) throw new Error("GITHUB_OWNER / GITHUB_REPO not set");
  return `${BASE}/repos/${owner}/${repo}/contents/${path}`;
}

async function getSha(path: string): Promise<string | null> {
  const res = await fetch(repoUrl(path), { headers: headers() });
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha ?? null;
}

export async function ghWrite(
  path: string,
  content: string,
  commitMsg: string
): Promise<void> {
  const sha = await getSha(path);
  const body: Record<string, unknown> = {
    message: commitMsg,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch: "main",
  };
  if (sha) body.sha = sha;

  const res = await fetch(repoUrl(path), {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${err}`);
  }
}

export async function ghWriteBinary(
  path: string,
  buffer: Buffer,
  commitMsg: string
): Promise<void> {
  const sha = await getSha(path);
  const body: Record<string, unknown> = {
    message: commitMsg,
    content: buffer.toString("base64"),
    branch: "main",
  };
  if (sha) body.sha = sha;

  const res = await fetch(repoUrl(path), {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${err}`);
  }
}

export async function ghDelete(path: string, commitMsg: string): Promise<void> {
  const sha = await getSha(path);
  if (!sha) return;

  const res = await fetch(repoUrl(path), {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ message: commitMsg, sha, branch: "main" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub delete failed (${res.status}): ${err}`);
  }
}

export async function ghReadJson<T>(path: string, fallback: T): Promise<T> {
  const res = await fetch(repoUrl(path), {
    headers: headers(),
    next: { revalidate: 0 },
  });
  if (!res.ok) return fallback;
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  try {
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}
