import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface RecommendingDoc extends BaseDoc {
	recommendedBy: ObjectID;
	recommendedTo: ObjectID;
	content: string;
}

/**
 * concept: Recommending [User] [recomemendee] [recommendation]
 */
export default class RecommendingConcept {
	public readonly recommendations: DocCollection<PostDoc>;

	/**
	 * Make an instance of Recommending.
	 */
	constructor(collectionName: string) {
		this.recommendations = new DocCollection<PostDoc>(collectionName);
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
		return await this.comments.readMany({ author });
	}

	async assertAuthorIsUser(_id: ObjectId, user:ObjectId) {
		const comment = await this.comments.readOne({ _id });
		if (!comment) {
			throw new NotFoundError('Comment ${_id} does not exist!');
		}
		if (post.author.toString() !== user.toString()) {
			throw new PostAuthorNotMatchError(user, _id);
		}
	}


export class PostAuthorNotMatchError extends NotAllowedError {
	constructor(
		public readonly author: ObjectId,
		public readonly _id: ObjectId,
		) {
		super("{0} is not the author of recommendation {1}!", author, _id);
	}
}
}