class Person {
  constructor(name) {
    this.name = name;
  }
}
async function add() {
  const person = await Person.findOne({ name: "Ian Fleming" })
    .populate("stories")
    .exec(); // only works if we pushed refs to children
  console.log(person);
}
add();
