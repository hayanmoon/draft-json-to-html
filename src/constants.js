export const BLOCK_TYPE = {
  HEADER_TWO: "header-two",
  UNSTYLED: "unstyled",
  ULIST: "unordered-list-item",
  OLIST: "ordered-list-item"
};

export const ENTITY_TYPE = {
  MENTION: "MENTION",
  LINK: "LINK"
};

//placeholder for entities
export const ENTITY = {
  Mention: props => <div>{props.children}</div>,
  Link: props => <div>{props.children}</div>
};
