export type ImageFormat = {
  name: string
  url: string
}

export type ImageFormats = {
  large: ImageFormat
  medium: ImageFormat
  small: ImageFormat
  thumbnail: ImageFormat
}

export type BackgroundImage = {
  data: {
    attributes: {
      alternativeText: string
      caption: string
      createdAt: Date
      ext: string
      formats: ImageFormat
      mime: string
      name: string
      previewUrl: string | null
      provider: string
      url: string
    },
    id: number
  }
}

export type BottomText = {
  email: string
  id: number
  label: string
  title: string
}
export type Button = {
  href: string
  id: number
  label: string
  target: string
  theme: string
}

export type Input = {
  id: number
name: string
placeholder: string
type: string
value: string | number | null
}

export type LoginPageData = {

    backgroundImage: BackgroundImage
    bottomText: BottomText
    button: Button
    emailErrorMsg: string
    emailRegex: string
    input: Input[]
    label: string
    logo: {
      id: number
      image: BackgroundImage
    }
    passwordErrorMsg: string
    publishedAt: Date
    passwordRegex: string
    title: string
}

export type LoginData = {
  data: {
    attributes: LoginPageData;
  };
};

export type ResetPaswordStateInput = {
  confirmPassword: string;
  password: string;
  error: string;
  success: string;
  isNew: boolean;
  expired: boolean;
};
