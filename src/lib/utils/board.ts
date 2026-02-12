import { invalidateAll } from '$app/navigation';

export async function deleteIssue(issueId: string) {
	const formData = new FormData();
	formData.append('issue_id', issueId);
	let res = await (
		await fetch(`?/deleteIssue`, {
			method: 'POST',
			body: formData
		})
	).json();

	if (res.status == 200) {
		await invalidateAll();
		return;
	}

	console.log(res);
}

export async function updateIssueStatus(issueId: string, newStatus: string) {
	const formData = new FormData();
	formData.append('issue_id', issueId);
	formData.append('status', newStatus);

	const res = await fetch(`?/updateIssueStatus`, {
		method: 'POST',
		body: formData
	});

	if (!res.ok) {
		throw new Error('Failed to update issue status');
	}

	const data = await res.json();
	if (data.status !== 200) {
		throw new Error(data.error || 'Update failed');
	}

	return data;
}
