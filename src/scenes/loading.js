//An actor is one of the characters in our scene
//they are automatically instantiated to be interactive
class Loading extends Phaser.Scene {
    constructor(scene, label){
        super("loadingScene");
        this.scene = scene;
        this.label = label;
    }
    preload(){
        this.load.image('timer', 'assets/loading.png')
    }
    create(){
        this.timer = this.add.image(game.config.width / 2, game.config.height / 2, 'timer');
        this.timer.setDisplaySize(game.config.width, game.config.height);
        console.log("loading scene");

    }
	start(callback, duration = 45000)
	{
		this.stop()

		this.finishedCallback = callback
		this.duration = duration

		this.timerEvent = this.scene.time.addEvent({
			delay: duration,
			callback: () => {
				this.label.text = '0'

				this.stop()
				
				if (callback)
				{
					callback()
				}
			}
		})
	}

	stop()
	{
		if (this.timerEvent)
		{
			this.timerEvent.destroy()
			this.timerEvent = undefined
		}
	}

	update()
	{
		if (!this.timerEvent || this.duration <= 0)
		{
			return
		}

		const elapsed = this.timerEvent.getElapsed()
		const remaining = this.duration - elapsed
		const seconds = remaining / 1000

		this.label.text = seconds.toFixed(2)
	}
}
