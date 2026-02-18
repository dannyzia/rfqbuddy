import { clarificationService } from '../clarification.service';
import type { CreateQuestionInput, AnswerQuestionInput } from '../../schemas/clarification.schema';

// Mock the database
jest.mock('../../config/database');
jest.mock('../../config/logger');

describe('ClarificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createQuestion', () => {
    it('should create a question on published tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const vendorOrgId = 'org-vendor-001';

      const input: CreateQuestionInput = {
        questionText: 'What is the delivery timeline?',
        isPublic: true,
      };

      const mockTender = { id: tenderId, status: 'published' };
      const mockCreatedQuestion = {
        id: 'question-001',
        tender_id: tenderId,
        vendor_org_id: vendorOrgId,
        question_text: 'What is the delivery timeline?',
        is_public: true,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedQuestion] })
        .mockResolvedValueOnce({ rows: [] }); // UPDATE tend status

      const result = await clarificationService.createQuestion(tenderId, vendorOrgId, input);

      expect(result).toEqual(mockCreatedQuestion);
      expect(result.status).toBe('open');
    });

    it('should create a question on clarification tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-002';
      const vendorOrgId = 'org-vendor-001';

      const input: CreateQuestionInput = {
        questionText: 'How do we handle logistics?',
        isPublic: false,
      };

      const mockTender = { id: tenderId, status: 'clarification' };
      const mockCreatedQuestion = {
        id: 'question-002',
        tender_id: tenderId,
        vendor_org_id: vendorOrgId,
        question_text: 'How do we handle logistics?',
        is_public: false,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedQuestion] });

      const result = await clarificationService.createQuestion(tenderId, vendorOrgId, input);

      expect(result.is_public).toBe(false);
      // UPDATE should NOT be called for clarification status tenders
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
    });

    it('should update tender status from published to clarification', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'published' };
      const mockCreatedQuestion = { id: 'question-001', status: 'open' };

      const input: CreateQuestionInput = {
        questionText: 'Test question',
        isPublic: true,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedQuestion] })
        .mockResolvedValueOnce({ rows: [] });

      await clarificationService.createQuestion('tender-001', 'vendor-001', input);

      expect(mockDatabase.pool.query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE tenders'), [
        'tender-001',
      ]);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input: CreateQuestionInput = {
        questionText: 'Test',
        isPublic: true,
      };

      await expect(
        clarificationService.createQuestion('tender-999', 'vendor-001', input)
      ).rejects.toThrow('Tender not found');
    });

    it('should throw error if tender not in valid status', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'awarded' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      const input: CreateQuestionInput = {
        questionText: 'Test',
        isPublic: true,
      };

      await expect(
        clarificationService.createQuestion('tender-001', 'vendor-001', input)
      ).rejects.toThrow('Questions can only be asked on published tenders');
    });
  });

  describe('findQuestionById', () => {
    it('should return a question by ID', async () => {
      const mockDatabase = require('../../config/database');
      const mockQuestion = {
        id: 'question-001',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        question_text: 'What is the delivery?',
        is_public: true,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockQuestion] });

      const result = await clarificationService.findQuestionById('question-001');

      expect(result).toEqual(mockQuestion);
    });

    it('should return null if question not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await clarificationService.findQuestionById('question-999');

      expect(result).toBeNull();
    });
  });

  describe('findQuestionsByTenderId', () => {
    it('should return all questions for a tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';

      const mockQuestions = [
        {
          id: 'question-001',
          tender_id: tenderId,
          vendor_org_id: 'vendor-001',
          question_text: 'Question 1',
          is_public: true,
          status: 'open',
          created_at: new Date().toISOString(),
        },
        {
          id: 'question-002',
          tender_id: tenderId,
          vendor_org_id: 'vendor-002',
          question_text: 'Question 2',
          is_public: false,
          status: 'answered',
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockQuestions });

      const result = await clarificationService.findQuestionsByTenderId(tenderId);

      expect(result).toEqual(mockQuestions);
      expect(result).toHaveLength(2);
    });

    it('should filter by vendor org ID', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const vendorOrgId = 'vendor-001';

      const mockQuestions = [
        {
          id: 'question-001',
          tender_id: tenderId,
          vendor_org_id: vendorOrgId,
          question_text: 'My question',
          is_public: true,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockQuestions });

      const result = await clarificationService.findQuestionsByTenderId(tenderId, vendorOrgId);

      expect(result).toHaveLength(1);
      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('vendor_org_id'),
        expect.arrayContaining([tenderId, vendorOrgId])
      );
    });

    it('should filter by isPublic status', async () => {
      const mockDatabase = require('../../config/database');
      const mockQuestions = [
        {
          id: 'question-001',
          tender_id: 'tender-001',
          vendor_org_id: 'vendor-001',
          question_text: 'Public question',
          is_public: true,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockQuestions });

      const result = await clarificationService.findQuestionsByTenderId('tender-001', undefined, true);

      expect(result[0].is_public).toBe(true);
    });

    it('should return empty array if no questions found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await clarificationService.findQuestionsByTenderId('tender-999');

      expect(result).toEqual([]);
    });
  });

  describe('answerQuestion', () => {
    it('should answer an open question', async () => {
      const mockDatabase = require('../../config/database');
      const questionId = 'question-001';
      const buyerUserId = 'buyer-001';
      const orgId = 'org-buyer-001';

      const input: AnswerQuestionInput = {
        answerText: 'The delivery timeline is 30 days',
        createsAddendum: false,
      };

      const mockQuestion = {
        id: questionId,
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        question_text: 'When do you deliver?',
        is_public: true,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      const mockTender = { buyer_org_id: orgId };

      const mockCreatedAnswer = {
        id: 'answer-001',
        question_id: questionId,
        buyer_user_id: buyerUserId,
        answer_text: 'The delivery timeline is 30 days',
        creates_addendum: false,
        answered_at: new Date().toISOString(),
      };

      const mockOpenCount = { count: '2' }; // Still have open questions

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockQuestion] })
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedAnswer] })
        .mockResolvedValueOnce({ rows: [] }) // UPDATE question status
        .mockResolvedValueOnce({ rows: [mockOpenCount] }); // Check open count

      const result = await clarificationService.answerQuestion(questionId, buyerUserId, orgId, input);

      expect(result).toEqual(mockCreatedAnswer);
    });

    it('should mark tender as published if no open questions remain', async () => {
      const mockDatabase = require('../../config/database');
      const questionId = 'question-001';

      const mockQuestion = { id: questionId, tender_id: 'tender-001', status: 'open' };
      const mockTender = { buyer_org_id: 'org-001' };
      const mockCreatedAnswer = { id: 'answer-001' };
      const mockOpenCount = { count: '0' }; // No more open questions

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockQuestion] })
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedAnswer] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockOpenCount] })
        .mockResolvedValueOnce({ rows: [] }); // UPDATE tender status

      const input: AnswerQuestionInput = {
        answerText: 'Answer text',
        createsAddendum: false,
      };

      await clarificationService.answerQuestion(questionId, 'buyer-001', 'org-001', input);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'published'"),
        expect.any(Array)
      );
    });

    it('should throw error if question not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input: AnswerQuestionInput = {
        answerText: 'Answer',
        createsAddendum: false,
      };

      await expect(
        clarificationService.answerQuestion('question-999', 'buyer-001', 'org-001', input)
      ).rejects.toThrow('Question not found');
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockQuestion = { id: 'question-001', tender_id: 'tender-001' };
      const mockTender = { buyer_org_id: 'org-002' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockQuestion] })
        .mockResolvedValueOnce({ rows: [mockTender] });

      const input: AnswerQuestionInput = {
        answerText: 'Answer',
        createsAddendum: false,
      };

      await expect(
        clarificationService.answerQuestion('question-001', 'buyer-001', 'org-001', input)
      ).rejects.toThrow('Not authorized');
    });

    it('should throw error if question already answered', async () => {
      const mockDatabase = require('../../config/database');
      const mockQuestion = { id: 'question-001', tender_id: 'tender-001', status: 'answered' };
      const mockTender = { buyer_org_id: 'org-001' };

      // answerQuestion calls findQuestionById, then queries tender, then checks status
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockQuestion] }) // findQuestionById
        .mockResolvedValueOnce({ rows: [mockTender] }); // SELECT tender

      const input: AnswerQuestionInput = {
        answerText: 'Answer',
        createsAddendum: false,
      };

      await expect(
        clarificationService.answerQuestion('question-001', 'buyer-001', 'org-001', input)
      ).rejects.toThrow('Question is already answered');

      // Should call findQuestionById AND tender lookup
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAnswerByQuestionId', () => {
    it('should return an answer for a question', async () => {
      const mockDatabase = require('../../config/database');
      const mockAnswer = {
        id: 'answer-001',
        question_id: 'question-001',
        buyer_user_id: 'buyer-001',
        answer_text: 'This is the answer',
        creates_addendum: false,
        answered_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockAnswer] });

      const result = await clarificationService.findAnswerByQuestionId('question-001');

      expect(result).toEqual(mockAnswer);
    });

    it('should return null if no answer found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await clarificationService.findAnswerByQuestionId('question-999');

      expect(result).toBeNull();
    });
  });

  describe('getQuestionsWithAnswers', () => {
    it('should return questions with their answers', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';

      const mockQuestions = [
        {
          id: 'question-001',
          tender_id: tenderId,
          vendor_org_id: 'vendor-001',
          question_text: 'Question 1',
          is_public: true,
          status: 'answered',
          created_at: new Date().toISOString(),
        },
        {
          id: 'question-002',
          tender_id: tenderId,
          vendor_org_id: 'vendor-002',
          question_text: 'Question 2',
          is_public: false,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ];

      const mockAnswers = [
        {
          id: 'answer-001',
          question_id: 'question-001',
          buyer_user_id: 'buyer-001',
          answer_text: 'Answer to question 1',
          creates_addendum: false,
          answered_at: new Date().toISOString(),
        },
        null, // No answer for question 2
      ];

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: mockQuestions })
        .mockResolvedValueOnce({ rows: [mockAnswers[0]] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await clarificationService.getQuestionsWithAnswers(tenderId);

      expect(result).toHaveLength(2);
      expect(result[0].answer).toBeDefined();
      expect(result[1].answer).toBeUndefined();
    });

    it('should filter by vendor org when provided', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const vendorOrgId = 'vendor-001';

      const mockQuestions = [
        {
          id: 'question-001',
          tender_id: tenderId,
          vendor_org_id: vendorOrgId,
          question_text: 'My question',
          is_public: true,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: mockQuestions })
        .mockResolvedValueOnce({ rows: [] });

      const result = await clarificationService.getQuestionsWithAnswers(tenderId, vendorOrgId);

      expect(result).toHaveLength(1);
    });
  });

  describe('closeQuestion', () => {
    it('should close an open question', async () => {
      const mockDatabase = require('../../config/database');
      const questionId = 'question-001';
      const orgId = 'org-buyer-001';

      const mockQuestion = {
        id: questionId,
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        question_text: 'Question',
        is_public: true,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      const mockTender = { buyer_org_id: orgId };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockQuestion] })
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [] }); // UPDATE

      await clarificationService.closeQuestion(questionId, orgId);

      expect(mockDatabase.pool.query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE'), [
        questionId,
      ]);
    });

    it('should throw error if question not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(clarificationService.closeQuestion('question-999', 'org-001')).rejects.toThrow(
        'Question not found'
      );
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockQuestion = { id: 'question-001', tender_id: 'tender-001' };
      const mockTender = { buyer_org_id: 'org-002' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockQuestion] })
        .mockResolvedValueOnce({ rows: [mockTender] });

      await expect(clarificationService.closeQuestion('question-001', 'org-001')).rejects.toThrow(
        'Not authorized'
      );
    });
  });
});
