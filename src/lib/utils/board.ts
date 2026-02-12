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
