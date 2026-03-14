import { api } from '../api-client';
import type { AiAgent, AiAnalytics } from '../api-types';

export const aiApi = {
  listAgents() {
    return api.get<AiAgent[]>('/api/ai/agents');
  },

  getAgent(agentId: string) {
    return api.get<AiAgent>(`/api/ai/agents/${agentId}`);
  },

  getAnalytics() {
    return api.get<AiAnalytics>('/api/ai/analytics');
  },

  updateAgentConfig(agentId: string, updates: Partial<Pick<AiAgent, 'enabled' | 'model' | 'spend_limit' | 'human_checkpoint'>>) {
    return api.patch<AiAgent>(`/api/ai/agents/${agentId}`, updates);
  },

  toggleAgent(agentId: string, enabled: boolean) {
    return api.patch<AiAgent>(`/api/ai/agents/${agentId}`, { enabled });
  },
};
