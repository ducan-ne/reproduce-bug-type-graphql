import {
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  createUnionType
} from 'type-graphql'
import { prop, Typegoose } from 'typegoose'
import { connect } from 'mongoose'

@ObjectType()
class Repo extends Typegoose {
  @prop()
  @Field(() => String)
  source_id: string
}
@ObjectType()
class Tree extends Typegoose {
  @prop()
  @Field(() => String)
  version: string
}

const TreeModel = new Tree().getModelForClass(Tree)
const RepoModel = new Repo().getModelForClass(Repo)

connect(
  `mongodb://localhost:27017/pm-v3`,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
)

const NodeQueryResult = createUnionType({
  name: 'NodeQueryResult',
  types: [Repo, Tree],
  description: 'Result node(id)',
  resolveType: (value) => {
    if ('source_id' in value) {
      return Repo
    }
    if ('version' in value) {
      return Tree
    }
    return null
  }
})

@Resolver()
export class TestResolver {
  @Query(() => NodeQueryResult, { nullable: true })
  async node(@Arg('id', () => String) id: string) {
    let node = await RepoModel.findOne({ _id: id })
    return node
  }
}
