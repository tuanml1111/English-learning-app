const axios = require('axios');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Lookup word definition using Free Dictionary API
// @route   GET /api/dictionary/lookup/:word
// @access  Public
exports.lookupWord = async (req, res, next) => {
  try {
    const { word } = req.params;

    if (!word) {
      return errorResponse(res, 400, 'Word parameter is required');
    }

    // Call Free Dictionary API
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.data || response.data.length === 0) {
      return errorResponse(res, 404, 'Word not found');
    }

    const wordData = response.data[0];

    // Extract relevant information
    const result = {
      word: wordData.word,
      phonetic: wordData.phonetic || '',
      phonetics: wordData.phonetics || [],
      meanings: wordData.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.slice(0, 3).map((def) => ({
          definition: def.definition,
          example: def.example || '',
          synonyms: def.synonyms || [],
          antonyms: def.antonyms || [],
        })),
      })),
      sourceUrls: wordData.sourceUrls || [],
    };

    return successResponse(res, 200, 'Word definition retrieved successfully', {
      word: result,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return errorResponse(res, 404, 'Word not found in dictionary');
    }
    next(error);
  }
};
