import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
	author: ObjectId;
	target: ObjectId;
	content: string;
}

/**
 * concept: Commenting [Author] [commentTarget]
 */
export default class CommentingConcept {
	public readonly comments: DocCollection<CommentDoc>;

	/**
	 * Make an instance of Commenting.
	 */
	constructor(collectionName: string) {
		this.comments = new DocCollection<CommentDoc>(collectionName);
	}

	async createComment(author: ObjectId, target: ObjectId, content: string) {
		const _id = await this.comments.createOne({author, target, content});
		return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
	}

	async getCommentsForUser(user: ObjectId) {
		// Returns all comments
		return await this.comments.readMany({}, { sort: { user: -1 } });
	}

	// async getCommentsOnPost() {
	// 	// Returns all comments on a single post
	// 	return await this.comments.readMany()
	// }

	async getByAuthor(author: ObjectId){
		return await this.comments.readMany({ author });
	}
}