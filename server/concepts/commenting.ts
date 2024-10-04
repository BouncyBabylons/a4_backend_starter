import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface CommentingDoc extends BaseDoc {
	author: ObjectId;
	content: string;
}

/**
 * concept: Commenting [Author] [commentTarget]
 */
export default class CommentingConcept {
	public readonly comments: DocCollection<CommentingDoc>;

	/**
	 * Make an instance of Commenting.
	 */
	constructor(collectionName: string) {
		this.comments = new DocCollection<CommentingDoc>(collectionName);
	}

	async create(author: ObjectId, content: string) {
		const _id = await this.comments.createOne({author, content});
		return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
	}

	async getComments() {
		// Returns all comments
		return await this.comments.readMany({}, { sort: { _id: -1 } });
	}

	async getByAuthor(author: ObjectId){
		return await this.comments.readMany({ author });
	}
}