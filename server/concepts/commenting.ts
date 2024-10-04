import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface PostDoc extends BaseDoc {
	author: ObjectID;
	content: string;
}

/**
 * concept: Commenting [Author] [commentTarget]
 */
export default class CommentingConcept {
	public readonly comments: DocCollection<PostDoc>;

	/**
	 * Make an instance of Commenting.
	 */
	constructor(collectionName: string) {
		this.comments = new DocCollection<PostDoc>(collectionName);
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