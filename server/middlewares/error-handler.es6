export default function *(next) {
  try {
    yield* next;
  } catch (err) {
    console.error(err.stack);
    this.status = err.status || 500;
    this.body = err.message;
  }
}
