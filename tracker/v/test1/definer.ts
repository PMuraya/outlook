// 
//Data type for the definers form
type definer = {
    id: string,
    select: string, //check on this.
    caption: string,
    organization: string,
    sequence: number
}
//
//Data type for the content form.
type content = {
    source: string,
    url: string,
    author: string,
    caption: string,
    definer: string
}