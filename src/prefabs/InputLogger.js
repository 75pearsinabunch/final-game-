//Input logger serves to store player input and hold it as a repository
//for use across all objects. 
class InputLogger {
  constructor() {
    //Variables
    this.actions = [];
  }

  pushAction(action){
    this.actions.push(action);
  }

  printActionList(){
    this.actions.forEach(function(action){
      console.log(action);
    })
  }
}