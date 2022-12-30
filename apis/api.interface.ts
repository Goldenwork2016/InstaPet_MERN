interface CharacterImages {
  secure_url: string;
  public_id: string;
}

export interface Characters {
  name: string;
  species: string;
  breed: string;
  images: string;
  user: string;
}
export interface Generate {
  user: string;
  model_name: string;
  style_name: string;
  image_url: string;
}
export interface AIGenerate extends Generate {
  username: string;
}

export interface mapRtr {
  src: string;
}

export interface sessionImages{
    userId: string,
  images_base_64: string[]

}

export interface user_type{
  user:string
}