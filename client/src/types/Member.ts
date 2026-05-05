
export type Members = {
  id: string
  displayName: string
  imageUrl?: string
  dateOfBirth: string
  country: string
  city: string
  gender: string
  description?: string
  dateCreated: string
  lastActive: string
}


export type Photo = {
  id: number
  url: string
  publicId?: string
  memberId: string
}

export type UpdateMember = {
  displayName : string
  description : string
  city : string
  country : string
}

export class MemberParam {
  gender? : string
  minAge = 18
  maxAge = 100
  pageNumber = 1
  pageSize = 10
  orderBy = "lastActive"
}

export class MemberLikeParam{
   predicate = 'liked'
   pageNumber = 1
   pageSize = 10 
}