import { Star, Sprout, Scale, Shield, Heart, Lightbulb, Users, Laptop, Image } from 'lucide-react'

export const values = {
  honesty: { name: 'Honesty', Icon: Star, color: '#ffe7a3', definition: 'Being truthful about what you do, say, and share.', example: 'If an AI tool helps you outline an essay, explain the help you received when your teacher asks how you worked.', question: 'What would you want a reader to know about how you made your work?' },
  independence: { name: 'Independence', Icon: Sprout, color: '#ddeed9', definition: 'Thinking for yourself and making your own decisions, even when you receive help.', example: 'Ask AI for a hint on a math problem, then try the next step yourself and explain why it works.', question: 'When does a hint help you learn, and when does it take over the thinking?' },
  fairness: { name: 'Fairness', Icon: Scale, color: '#dcebfa', definition: 'Considering whether people have fair opportunities and are treated justly.', example: 'If only some teammates can access a paid AI tool, choose a way of working everyone can take part in.', question: 'How would you include someone who cannot access the tool the rest of your group uses?' },
  privacy: { name: 'Privacy', Icon: Shield, color: '#e9ddf8', definition: 'Having a say in how information about you is shared and used.', example: 'Before uploading a friend’s photo to an AI tool, you could ask whether they’re comfortable with you sharing it.', question: 'What information would you want someone to ask permission before sharing?' },
  respect: { name: 'Respect', Icon: Heart, color: '#f8dddc', definition: 'Taking other people’s feelings, ideas, and choices seriously.', example: 'If AI suggests rewriting a classmate’s part of a script, ask which changes they want and keep the wording they feel comfortable saying.', question: 'How could you offer help while making room for someone to say no?' },
  responsibility: { name: 'Responsibility', Icon: Lightbulb, color: '#fbe3d0', definition: 'Thinking about how your actions affect others and taking ownership of your choices.', example: 'Before sharing an AI-written announcement, check the date and location. If you shared a mistake, tell people what changed.', question: 'What would you do if someone acted on incorrect information you shared?' },
}
export type ValueId = keyof typeof values
export const valueIds = Object.keys(values) as ValueId[]
type Consequence = [benefit: string, concern: string, perspective: string, question: string]
type Scenario = { title: string; description: string; Icon: typeof Users; color: string; story: string[]; tags: ValueId[]; tension: [ValueId, ValueId]; tensionQuestions: [string, string]; options: string[]; outcomes: Consequence[]; reminder: string }
export const scenarios: Record<string, Scenario> = {
  group: {
    title: 'The Group Project', description: 'A classmate is nervous about presenting. How could you help while respecting their choices?', Icon: Users, color: '#e9ddf8',
    tags: ['respect', 'fairness', 'independence', 'privacy', 'responsibility'], tension: ['respect', 'fairness'], tensionQuestions: ['How could you protect Alex’s say over their work?', 'What support would give Alex a fair chance to present with confidence?'],
    story: ['You’re working on a group presentation with three classmates. Your presentation is tomorrow.', 'One teammate, Alex, has been having trouble writing their part in English. Alex has worked hard on it but feels nervous about presenting.', 'You know an AI tool that could help improve the writing. Your teacher allows AI for editing, but students must explain how they used it.', 'You want to help Alex and make sure your group does well. But you’re not sure whether you should suggest using AI.'],
    options: ['Ask Alex whether they’d like to use AI together to improve their section.', 'Use AI to improve Alex’s section, then show Alex the changes.', 'Keep Alex’s writing as it is.', 'Suggest that Alex use AI on their own.'],
    outcomes: [
      ['Alex gets a say in the edits, and you can compare suggestions together.', 'Alex might feel pressure to agree. Working together may also take extra time.', 'Alex might say, “I want it to be clearer, but I want it to sound like me.”', 'How would you make it easy for Alex to decline?'],
      ['You could bring Alex some concrete editing ideas quickly.', 'Uploading Alex’s work without asking takes away their choice. The edits could change their meaning or voice.', 'Alex might feel their work was taken over even if you meant to help.', 'What could you show Alex before uploading any of their work?'],
      ['Alex keeps their original voice and control over their section.', 'Alex may still feel nervous, and the group misses a chance to offer support.', 'Alex might prefer practicing aloud together to changing their writing.', 'What support could you offer without editing the script?'],
      ['Alex could choose when and how to use the tool.', 'Alex may lack access or time, and could feel left to solve the problem alone.', 'Alex might welcome a suggestion but want someone to practice with.', 'How could you check what kind of help Alex actually wants?'],
      ['Your plan could give Alex a kind of support the listed actions miss, such as practicing together.', 'Check who decides about edits and whether your plan involves sharing Alex’s writing.', 'Alex may care more about feeling ready to present than about polished sentences.', 'Where in your plan can Alex make a choice?'],
    ],
    reminder: 'The teacher allows AI for editing and asks you to explain how you used it. Ask before sharing someone else’s work with a tool.',
  },
  essay: {
    title: 'A Convincing AI Answer', description: 'An AI gives you a statistic that would strengthen your essay, but you can’t find its source.', Icon: Laptop, color: '#ffe7a3',
    tags: ['honesty', 'independence', 'responsibility'], tension: ['honesty', 'responsibility'], tensionQuestions: ['What can you truthfully claim with the evidence you have?', 'How can you meet the deadline while giving readers evidence they can check?'],
    story: ['You’re writing an essay about how social media affects teenagers.', 'You ask an AI tool for information, and it gives you a convincing answer with several statistics.', 'One statistic would make your argument much stronger. But when you look for the original study, you can’t find it.', 'Your essay is due soon, and you’ve already spent a lot of time working on it.'],
    options: ['Use the statistic because the AI answer sounds convincing.', 'Leave out the statistic until you can verify it.', 'Ask the AI to provide more sources and check whether those sources are real.', 'Rewrite the argument using information you’ve already verified.'],
    outcomes: [
      ['Using the statistic could save time and make the paragraph sound more persuasive.', 'The statistic could be invented or wrong. Presenting it as evidence could mislead your reader.', 'Your teacher needs to see where the claim comes from and whether the study supports it.', 'What verified evidence could you use with the time you have?'],
      ['Leaving the statistic out keeps an unsupported number out of your essay.', 'The paragraph may need a narrower claim or a different example.', 'A reader can still follow a smaller claim when the evidence is clear.', 'Which sentence would you change if you removed the statistic?'],
      ['Suggested search terms or sources could give you a starting point.', 'AI can invent citations, too. Even a real study may say something different from the AI’s summary.', 'Your teacher may ask you to point to the exact finding in the original source.', 'How much time will you set aside to check before switching plans?'],
      ['You can stand behind the evidence and make the argument your own.', 'Rewriting takes time, and the revised claim may be more limited.', 'A reader may trust a specific claim backed by a source they can check.', 'What is the strongest claim your verified sources actually support?'],
      ['Your idea might help you finish by narrowing the claim or asking for help finding a source.', 'Check whether your plan presents any unverified number as a fact.', 'A reader should be able to tell which claims your sources support.', 'How will you handle the statistic if you still can’t find the study?'],
    ],
    reminder: 'AI can give inaccurate facts and invented citations with confidence. Use important claims as evidence only when you can verify them.',
  },
  photo: {
    title: 'A Friend’s Photo', description: 'You want to turn a friend’s photo into a cartoon. What should you consider before uploading it?', Icon: Image, color: '#f8dddc',
    tags: ['privacy', 'respect', 'responsibility', 'fairness'], tension: ['privacy', 'respect'], tensionQuestions: ['Where would the original photo go, and who could see the new image?', 'How can you make room for Maya’s preferences about how her photo is used?'],
    story: ['Your friend Maya posts a photo of herself online.', 'You think it would be fun to use an AI image tool to turn the photo into a cartoon. You want to share the result in your group chat.', 'Maya has shared photos with your friends before, but you’ve never asked whether she’s comfortable with her pictures being uploaded to an AI tool.', 'The AI tool also asks you to upload the original photo.'],
    options: ['Upload the photo and share the cartoon because Maya posted the original publicly.', 'Ask Maya whether she’s comfortable with you using her photo.', 'Create the cartoon but don’t share it.', 'Choose a different image that doesn’t show a real person.'],
    outcomes: [
      ['Your friends might enjoy seeing a playful cartoon.', 'Maya has not agreed to the upload or the new image being shared. Someone in the chat could forward it.', 'Maya might be comfortable with her own post and uncomfortable with a new version of it circulating.', 'What would you ask Maya before taking either step?'],
      ['Maya can decide about the upload and sharing separately.', 'She might feel pressured to agree, or want to know what the tool does with the photo first.', 'Maya could be comfortable seeing the cartoon herself and want it kept out of the group chat.', 'How can you make space for Maya to say no or ask you to wait?'],
      ['Keeping the cartoon to yourself limits who sees the result.', 'The original still goes to an outside service, which may store or use it according to its terms.', 'Maya might care about where the original goes even if nobody in the chat sees it.', 'Could you get the same creative result without uploading her photo?'],
      ['You can experiment with the tool while protecting Maya’s photo.', 'You’ll need an image you have permission to use, or you could draw one yourself.', 'Maya may appreciate being able to decide whether to be part of the joke.', 'What could you create that would still be fun to share?'],
      ['Your idea could give Maya control or let the group try a different creative project.', 'Consider both who receives the original and who could see or forward the result.', 'Maya might want to see the tool and decide what image to use herself.', 'How does your plan let Maya decide about each use of the photo?'],
    ],
    reminder: 'A public post gives people a place to view the photo. Ask permission before uploading someone’s photo to an AI service or sharing a new version.',
  },
}
export const basics = ['Check important information.', 'Protect personal information.', 'Ask permission before sharing someone else’s information.', 'Follow school rules about AI use.', 'Think about how AI-generated content may affect others.']
