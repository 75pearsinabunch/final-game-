//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputLogger {
  constructor() {
    //Variables
    this.actions = [];//used to store actions
  }

  //pushes a given action struct onto the actions stack
  //action: an input of form: {pointer, gameObject, event}
  pushAction(action){
    this.actions.push(action);
  }

  //Really just for testing purposes,
  //prints entire list of actions
  printActionList(){
    this.actions.forEach(function(action){
      console.log(action);
    })
  }
}