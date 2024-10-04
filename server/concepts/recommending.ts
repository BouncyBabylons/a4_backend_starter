import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface RecommendingDoc extends BaseDoc {
	recommendedBy: ObjectId;
	recommendedTo: ObjectId;
	content: string;
}

/**
 * concept: Recommending [User] [recomemendee] [recommendation]
 */
export default class RecommendingConcept {
	public readonly recommendations: DocCollection<RecommendingDoc>;

	/**
	 * Make an instance of Recommending.
	 */
	constructor(collectionName: string) {
		this.recommendations = new DocCollection<RecommendingDoc>(collectionName);
	}

	async create(author: ObjectId, content: string) {
		const _id = await this.recommendations.createOne({author, content});
		return { msg: "Recommendation successfully created!", recommendation: await this.recommendations.readOne({ _id }) };
	}

	async getRecommendations() {
		// Returns all recommendations
		return await this.recommendations.readMany({}, { sort: { _id: -1 } });
	}

	async getByAuthor(author: ObjectId){
		return await this.recommendations.readMany({ author });
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