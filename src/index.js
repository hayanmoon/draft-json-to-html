import React from "react";
import jsxToString from "jsx-to-string";
import { BLOCK_TYPE, ENTITY_TYPE, ENTITY } from "./constants";
const { Mention, Link } = ENTITY;

const formatBlocks = blocks => {
  //format list data
  return blocks.reduce((content, block) => {
    const { type, ...properties } = block;
    let counter = 0;
    if (type.indexOf("list") > -1) {
      //if block is a list
      const currentIndex = content.length - 1;
      const currentContent = content[currentIndex];
      //check last content if type list
      if (currentContent.type.indexOf("list") > -1) {
        currentContent.items.push({ ...properties });
        return content;
      }
      content.push({
        type,
        items: [{ ...properties }]
      });
      return content;
    } else {
      //if not a list
      content.push(block);
      return content;
    }
  }, []);
};

const buildArticle = (blocks, entityMap) => {
  return <article>{createStringElements(blocks, entityMap)}</article>;
};

const createStringElements = (blocks, entityMap) => {
  return blocks.reduce((elements, block) => {
    elements += jsxToString(createElement(block, entityMap));
    return elements;
  }, "");
};

const createElement = (block, entityMap) => {
  const { type, text, items, entityRanges, key } = block;
  const withEntities = entityRanges && entityRanges.length > 0;
  let textWithEntities = "";

  if (withEntities) {
    //apply entities if present
    textWithEntities = applyEntities(entityMap, entityRanges, text);
  }
  switch (type) {
    case BLOCK_TYPE.UNSTYLED:
      return <p>{withEntities ? textWithEntities : text}</p>;
      break;
    case BLOCK_TYPE.HEADER_TWO:
      return <h2>{withEntities ? textWithEntities : text}</h2>;
      break;
    case BLOCK_TYPE.ULIST:
      return <ul>{createListElements(items, entityMap)}</ul>;
      break;
    case BLOCK_TYPE.OLIST:
      return <ol>{createListElements(items, entityMap)}</ol>;
      break;
    default:
      return "";
      break;
  }
};

const createListElements = (items, entityMap) => {
  const list = items.reduce((elements, item) => {
    elements += jsxToString(<li>{item.text}</li>);
    return elements;
  }, "");
  return list;
};

const applyEntities = (entityMap, entityRanges, text) => {
  return entityRanges.reduce((modifiedText, entity) => {
    const word = text.substring(entity.offset, entity.offset + entity.length);
    const entityProperties = entityMap && entityMap[entity.key];
    let createdEntity = null;
    switch (entityProperties.type) {
      case ENTITY_TYPE.MENTION:
        createdEntity = <Mention data={entityProperties.data}>{word}</Mention>;
        break;
      case ENTITY_TYPE.LINK:
        createdEntity = <Link data={entityProperties.data}>{word}</Link>;
        break;
      default:
        return null;
    }
    return modifiedText.replace(word, jsxToString(createdEntity));
  }, text);
};

export default function draftJsToHtml({ blocks, entityMap }) {
  if (blocks.length < 1) {
    return ""; //return blank string if no blocks available
  }
  const formattedBlocks = formatBlocks(blocks);
  const article = buildArticle(formattedBlocks, entityMap);
  return jsxToString(article);
}
