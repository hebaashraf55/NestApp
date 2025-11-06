import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
})
export class Category {

 @Prop({
    type: String,
    unique: true,
    minLength: 3,
    maxLength: 25,
    required : true,
    })
    name:string;


 @Prop({
    type: String,
    minLength: 3,
    maxLength: 1000,
    })
    description ?: string

 @Prop({
    type: String,
    minLength: 3,
    maxLength: 50,
    })
    slug:string;

 @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    })
  createdBy: Types.ObjectId;

 @Prop({
      type: String,
      required: true,
    })
    image: string;

 @Prop({
      type: [{ type : mongoose.Schema.Types.ObjectId, ref: "Brand" }],
    })
    brands: Types.ObjectId[];
}

export const categorySchema = SchemaFactory.createForClass(Category);
categorySchema.pre(
  'save',
  async function (next) {

    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
  },
);
export type CategoryDocument = HydratedDocument<Category>;
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: categorySchema },
]);
