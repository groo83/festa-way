export interface Festival {
    name: string;
    date: string;
    //time: string;
    location: string;
    description: string;
    contact: string;
}
  
/**
 * LAAS 응답 content에서 축제 정보를 배열로 파싱
 */
export function parseFestivalContent(content: string): Festival[] {
    const festivalBlocks = content.split(/\n\n(?=\d+\.\s\*\*)/); // 각 축제 블록 분리
    const festivals: Festival[] = [];

    for (const block of festivalBlocks) {
        const nameMatch = block.match(/\*\*(.*?)\*\*/);
        const dateMatch = block.match(/\*\*일정:\s*(.*)/);
        //const timeMatch = block.match(/\*\*운영시간:\s*(.*)/);
        const locationMatch = block.match(/\*\*장소:\s*(.*)/);
        const descriptionMatch = block.match(/\*\*내용:\s*(.*)/);
        const contactMatch = block.match(/\*\*참고:\s*(.*)/);

        const clean = (str: string | undefined) =>
            str?.replace(/\*\*/g, '').trim() || '';

        if (nameMatch) {
            festivals.push({
                name: clean(nameMatch[1]),
                date: clean(dateMatch?.[1]),
                //time: clean(timeMatch?.[1]),
                location: clean(locationMatch?.[1]),
                description: clean(descriptionMatch?.[1]),
                contact: clean(contactMatch?.[1]),
            });
        }
    }

    console.log('Parsed festivals:', festivals);
    return festivals;
}
