import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface RecommendationDoc extends BaseDoc {
	recommendedBy: ObjectId;
	recommendedTo: ObjectId;
	content: ObjectId;
}

/**
 * concept: Recommending [User] [recomemendee] [recommendation]
 */
export default class RecommendingConcept {
	public readonly recommendations: DocCollection<RecommendationDoc>;

	/**
	 * Make an instance of Recommending.
	 */
	constructor(collectionName: string) {
		this.recommendations = new DocCollection<RecommendationDoc>(collectionName);
	}

	async makeRecommendation(recommendedBy: ObjectId, recommendedTo: ObjectId, content: ObjectId) {
		const _id = await this.recommendations.createOne({recommendedBy, recommendedTo, content});
		return { msg: "Recommendation successfully created!", recommendation: await this.recommendations.readOne({ _id }) };
	}

	async getRecommendations() {
		// Returns all recommendations
		return await this.recommendations.readMany({}, { sort: { _id: -1 } });
	}

	async getRecommendationsForUser(user: ObjectId){
		return await this.recommendations.readMany({ user });
	}

	async delete(_id: ObjectId) {
		await this.recommendations.deleteOne({ _id });
		return { msg: "Recommendation deleted successfully!" };
	}

	async assertAuthorIsUser(_id: ObjectId, user:ObjectId) {
		const recommendation = await this.recommendations.readOne({ _id });
		if (!recommendation) {
			throw new NotFoundError('Recommendation ${_id} does not exist!');
		}
		if (recommendation.recommendedBy.toString() !== user.toString()) {
			throw new NotFoundError("Try again dude");
		}
	}
}