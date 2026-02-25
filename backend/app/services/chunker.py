"""Semantic text chunker for sermon content.

Uses LlamaIndex's SentenceSplitter for intelligent chunking that respects
sentence boundaries. Preserves source metadata through each chunk.
"""

from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import Document, TextNode
from app.config import get_settings

settings = get_settings()


def chunk_text(
    text: str,
    metadata: dict | None = None,
    chunk_size: int | None = None,
    chunk_overlap: int | None = None,
) -> list[dict]:
    """Split text into semantic chunks with metadata preservation.

    Returns list of dicts: {"content": str, "chunk_index": int, "metadata": dict}
    """
    chunk_size = chunk_size or settings.chunk_size
    chunk_overlap = chunk_overlap or settings.chunk_overlap
    metadata = metadata or {}

    splitter = SentenceSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        paragraph_separator="\n\n",
        secondary_chunking_regex=r"[.。!！?？;；]\s*",
    )

    doc = Document(text=text, metadata=metadata)
    nodes = splitter.get_nodes_from_documents([doc])

    chunks = []
    for i, node in enumerate(nodes):
        chunks.append({
            "content": node.get_content(),
            "chunk_index": i,
            "metadata": {**metadata, "chunk_of": len(nodes)},
        })

    return chunks


def chunk_sermon_pages(
    page_texts: list[str],
    metadata: dict | None = None,
    chunk_size: int | None = None,
    chunk_overlap: int | None = None,
) -> list[dict]:
    """Chunk sermon with page-awareness.

    Processes pages individually to maintain page number tracking,
    then assigns page numbers to each chunk.
    """
    metadata = metadata or {}
    all_chunks = []
    global_index = 0

    # First, join all pages
    full_text = "\n\n".join(page_texts)

    # Chunk the full text
    raw_chunks = chunk_text(full_text, metadata, chunk_size, chunk_overlap)

    # Map each chunk back to its page(s)
    char_offset = 0
    page_boundaries = []
    for i, page_text in enumerate(page_texts):
        page_boundaries.append((char_offset, char_offset + len(page_text), i + 1))
        char_offset += len(page_text) + 2  # Account for \n\n separator

    for chunk in raw_chunks:
        chunk_text_content = chunk["content"]
        # Find which page this chunk starts in
        chunk_start = full_text.find(chunk_text_content)
        page_num = 1
        if chunk_start >= 0:
            for start, end, pnum in page_boundaries:
                if start <= chunk_start < end:
                    page_num = pnum
                    break

        chunk["page_number"] = page_num
        chunk["chunk_index"] = global_index
        global_index += 1
        all_chunks.append(chunk)

    return all_chunks
