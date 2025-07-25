export function randomGarfDate() {
	const start = new Date('1978-06-19');
	const end = new Date();
	const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return randomDate;
}