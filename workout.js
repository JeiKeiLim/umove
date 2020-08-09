import * as posenet from '@tensorflow-models/posenet';

export class DoSomeWorkout {

	constructor(vWidth, vHeight) {
		this.vWidth = vWidth;
		this.vHeight = vHeight;

		this.windowSeconds = 10.0;
		this.strideSeconds = 2.0;

		this.keypoints = [];
		this.times = [];

		this.sTime = ( performance || Date ).now()

		console.log(this.beginTime)
	}

	arriveKeypoints(poses, minPoseConfidence, minPartConfidence) {
		let time = ( performance || Date ).now()
		this.times.push(time-this.sTime);
		this.sTime = time;

		// Computing Hz
		let totalTime = this.times.reduce((a, b) => a+b, 0);

		if(totalTime > this.windowSeconds*1000) {
			let hz = this.times.length / this.windowSeconds;

			let meanTime = totalTime / this.times.length;
			var i;
			for(i=0; i<Math.round((this.strideSeconds*1000) / meanTime); i++) {
				this.times.pop(0);
			}

			console.log("totalTime: ", totalTime);
			console.log("Hz: ", hz);
		}

		let poseIdx = poses.reduce((idx, pose, i, arr) => pose.score > arr[idx] ? i : idx, 0);
		let pose = poses[poseIdx];

		
		poses.forEach(({score, keypoints}) => {
			if (score >= minPoseConfidence) {
				this.keypoints.push(keypoints);
			}
		});

		// Do some workout counting here

		var i;
		for(i=0; i<(this.keypoints.length-this.times.length); i++) {
			this.keypoints.pop(0);
		}
	}
}