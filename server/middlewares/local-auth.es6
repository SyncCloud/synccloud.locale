export default function *securedPage(next) {
  if (this.isAuthenticated()) {
    yield* next;
  } else {
    this.redirect('/login');
  }
}
