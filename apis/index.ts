import type { NextApiRequest } from 'next';
import { AIGenerate, Characters, Generate, sessionImages } from './api.interface';
import axios from 'axios';

const auth_with_email = async (data: { email: string }) => {
  try {
    const config = {
      url: `/api/auth`,
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const character_upload = async (data: Characters) => {
  console.log(1, data);
  try {
    const config = {
      url: `/api/character/upload`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
const get_character_list = async (data: { user: string }) => {
  try {
    const config = {
      url: `/api/character/character_list`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
const character_tag_upload = async (data: {
  tag: string;
  public_ids: string[];
}) => {
  try {
    const config = {
      url: `/api/cloudinary/uploadTag`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
const search_tag_upload = async (data: {
  tag: string;
  next_cursor?: string;
}) => {
  try {
    const config = {
      url: `/api/cloudinary/search`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};
const get_our_picks = async () => {
  try {
    const config = {
      url: `/api/character/our_picks`,

      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};
const get_image_detail = async (data: { public_id: string }) => {
  try {
    const config = {
      url: `/api/cloudinary/getImageDetail`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const check_character = async (data: { name: string }) => {
  console.log(1, data);
  try {
    const config = {
      url: `/api/character/check_character`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
const upload_kubernetes_server = async (data: {
  name: string;
  username: string;
}): Promise<any> => {
  try {
    const config = {
      url: `/api/character/meta_data`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
    // return {
    //   data: { Received: `new model creation in progress :${data.name}` },
    // };
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};
const check_progress = async (data: {
  name: string;
  userid: string;
  key: string;
}) => {
  try {
    const config = {
      url: `/api/character/check_progress`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};
const generate_character = async (data: { userid: string; key: string }) => {
  try {
    const config = {
      url: `/api/character/generate_character`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error.message);
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
    // throw new Error(error.message);
  }
};

const save_generate_from_ai = async (data: Generate) => {
  try {
    const config = {
      url: `/api/character/generate`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
    // throw new Error(error.message);
  }
};
const generate_from_ai = async (data: AIGenerate) => {
  try {
    const config = {
      url: `/api/character/generate?isGenerate=true`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};

const get_user_favorites_list = async (userid: string) => {
  try {
    const config = {
      url: `/api/character/favorites`,
      data: { userid },
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};
const toggle_favorites = async (data: {
  public_ids: string[];
  tag: string;
  isFavorite: boolean;
}) => {
  try {
    const url = data.isFavorite
      ? `/api/cloudinary/removeTag`
      : `/api/cloudinary/uploadTag`;
    const config = {
      url: url,
      data: {
        public_ids: data.public_ids,
        tag: data.tag,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return {
      data: { success: 0, message: error.message },
      error: error.message,
    };
  }
};

const get_all_favorites = async (data: { user_id: string }) => {
  try {
    const config = {
      url: `/api/character/toggle_favorites?all=true`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
};

const collections = async (userid: string) => {
  try {
    const config = {
      url: `/api/character/collection`,
      data: { userid },
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
};
const live_feed_generation = async (userid: string) => {
  try {
    const config = {
      url: `/api/character/live_generation_feed`,
      data: { userid },
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
};
const get_username = async (userid: string) => {
  try {
    const config = {
      url: `/api/character/get_username`,
      data: { userid },
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
};
const post_session_images = async (data: sessionImages) => {
  try {
    const config = {
      url: `/api/character/session_images`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
}

const get_session_images = async (userid:string) => {
  try {
    const config = {
      url: `/api/character/session_images?user=${userid}`,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
}

const delete_session_images = async (userid:string) => {
  try {
    const config = {
      url: `/api/character/session_images?user=${userid}`,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    };
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log(error);
  }
}

export {
  get_session_images,
  post_session_images,
  toggle_favorites,
  delete_session_images,
  get_user_favorites_list,
  auth_with_email,
  character_upload,
  check_character,
  character_tag_upload,
  search_tag_upload,
  upload_kubernetes_server,
  check_progress,
  generate_character,
  get_image_detail,
  generate_from_ai,
  save_generate_from_ai,
  get_our_picks,
  collections,
  get_all_favorites,
  get_character_list,
  live_feed_generation,
  get_username,
};
